# FILE: backend/app/database/models.py
# PURPOSE: SQLAlchemy ORM models mapping users, student profiles, stakeholders, and invitations.
# PHASE: 3 | DEPENDS ON: sqlalchemy, session.py | LAST TOUCHED: Phase 3

from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base


# Represents registered user accounts across all four personas (Student, Institution, Government, Employer).
# Encapsulates role scopes and organization bindings.
class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), nullable=False)  # 'student', 'institution', 'government', 'employer'
    org_id = Column(String(64), nullable=True)  # college or company ID
    district_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # One-to-one relationship with student profile (if role == 'student')
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)


# Represents persisted academic, regional, and skill ratings for a student candidate.
# Stores skill proficiency ratings as a serialized JSON string for schema flexibility.
class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True, unique=True)
    full_name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=True)
    institution_name = Column(String(256), nullable=False)
    region = Column(String(64), nullable=False)
    department = Column(String(128), nullable=False)
    degree_field = Column(String(64), nullable=False)
    current_year_of_study = Column(Integer, default=3)
    graduation_year = Column(Integer, default=2026)
    career_intent = Column(String(64), default="Campus Placement")
    target_work_mobility = Column(String(64), default="Pan-India")
    target_role_slug = Column(String(64), default="fullstack-developer")
    skills_json = Column(Text, nullable=False, default="{}")
    is_demo_account = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")


# Represents regional administrative districts.
# Backing store for regional labor market telemetry and deficit analysis.
class District(Base):
    __tablename__ = "districts"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    state = Column(String(128), nullable=False)
    tier = Column(Integer, default=2)
    economic_focus = Column(String(256), default="")


# Represents higher education institutions and universities.
# Backing store for curriculum audits and departmental heatmaps.
class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    aishe_code = Column(String(64), nullable=True, unique=True)
    district_id = Column(String(64), nullable=False)
    state = Column(String(128), nullable=False)
    type = Column(String(64), default="University")


# Represents course syllabus records audited for market competency alignment.
# Classifies curriculum modules as ALIGNED, AT RISK, or OBSOLETE.
class CurriculumCourse(Base):
    __tablename__ = "curriculum_courses"

    id = Column(String(64), primary_key=True, index=True)
    institution_id = Column(String(64), nullable=False, index=True)
    department = Column(String(128), nullable=False)
    course_code = Column(String(32), nullable=False)
    course_name = Column(String(256), nullable=False)
    mapped_skills_json = Column(Text, default="[]")
    status = Column(String(32), default="ALIGNED")  # ALIGNED, AT RISK, OBSOLETE
    recommended_action = Column(Text, default="")


# Represents formal interview invitations issued by employers to candidate profiles.
# Enables blind sourcing privacy: candidate names remain masked until invitation is accepted.
class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(String(64), primary_key=True, index=True)
    employer_id = Column(String(64), nullable=False, index=True)
    student_id = Column(String(64), nullable=False, index=True)
    role_title = Column(String(128), nullable=False)
    status = Column(String(32), default="pending")  # 'pending', 'accepted', 'declined'
    created_at = Column(DateTime, default=datetime.utcnow)
