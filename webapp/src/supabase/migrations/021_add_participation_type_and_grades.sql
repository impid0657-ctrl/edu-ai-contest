-- 021: 중고등부 개인/팀 참가 분기 지원용 컬럼 추가
-- participation_type: individual / team
-- member*_grade: 팀원별 학년

ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS participation_type TEXT;
ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS member1_grade TEXT;
ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS member2_grade TEXT;
ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS member3_grade TEXT;

COMMENT ON COLUMN license_applications.participation_type IS '참가인원 유형 (individual/team)';
COMMENT ON COLUMN license_applications.member1_grade IS '팀원1 학년';
COMMENT ON COLUMN license_applications.member2_grade IS '팀원2 학년';
COMMENT ON COLUMN license_applications.member3_grade IS '팀원3 학년';
