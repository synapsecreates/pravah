# FILE: backend/app/core/security.py
# PURPOSE: Cryptographic password hashing, JWT token lifecycle, and role-based access authorization.
# PHASE: 3 | DEPENDS ON: hashlib, secrets, pyjwt, fastapi | LAST TOUCHED: Phase 3

import hashlib
import os
import secrets
from datetime import datetime, timedelta
from typing import Callable, Dict, List, Optional
import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Security constants for JWT token issuance
SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "pravah-cryptographic-signing-key-2026-evaluation")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

# Role-specific permission scopes dictionary
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "student": ["student:read_self", "student:update_profile", "student:run_simulator"],
    "institution": ["institution:read_cohort_aggregate", "institution:audit_curriculum"],
    "government": ["government:read_regional_macro", "government:view_deficit_matrix"],
    "employer": ["employer:browse_106_taxonomy", "employer:parse_custom_jd", "employer:search_talent_cohorts"],
    "superadmin": [
        "student:read_self",
        "student:update_profile",
        "student:run_simulator",
        "institution:read_cohort_aggregate",
        "institution:audit_curriculum",
        "government:read_regional_macro",
        "government:view_deficit_matrix",
        "employer:browse_106_taxonomy",
        "employer:parse_custom_jd",
        "employer:search_talent_cohorts",
    ],
}

# Bearer security scheme for Swagger UI and Authorization headers
bearer_scheme = HTTPBearer(auto_error=False)


# Generates a salted PBKDF2-HMAC-SHA256 hash from a plaintext password.
# Uses 100,000 iterations and a cryptographically secure 16-byte random salt.
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), 100000
    )
    return f"{salt}${key.hex()}"


# Verifies that a plaintext password matches the stored salted hash.
# Uses constant-time comparison to protect against timing attacks.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, stored_hash = hashed_password.split("$")
        key = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), bytes.fromhex(salt), 100000
        )
        return secrets.compare_digest(key.hex(), stored_hash)
    except Exception:
        return False


# Encodes a JWT bearer access token with identity, role scopes, and expiration timestamp.
# Returns serialized JWT string signed with the HMAC-SHA256 algorithm.
def create_access_token(
    user_id: str,
    role: str,
    email: Optional[str] = None,
    org_id: Optional[str] = None,
    district_id: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    permissions = ROLE_PERMISSIONS.get(role.lower(), [])

    payload = {
        "sub": user_id,
        "email": email or f"{user_id}@pravah.internal",
        "role": role.lower(),
        "org_id": org_id,
        "district_id": district_id,
        "permissions": permissions,
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# Decodes and validates a JWT token payload.
# Raises HTTPException 401 if token signature is invalid or expired.
def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired. Please refresh your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Dependency resolving current user identity and permissions from the bearer token.
# Raises HTTP 401 if no valid authorization header is present.
def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme),
) -> dict:
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Missing or invalid Authorization header.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return decode_access_token(auth.credentials)


# Factory returning an endpoint dependency enforcing role-based access control.
# Rejects requests with HTTP 403 Forbidden if the user's role is not allowed.
def require_roles(allowed_roles: List[str]) -> Callable:
    allowed_set = {r.lower() for r in allowed_roles}

    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "").lower()
        if user_role != "superadmin" and user_role not in allowed_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Role '{user_role}' is not authorized to access this resource.",
            )
        return current_user

    return role_checker
