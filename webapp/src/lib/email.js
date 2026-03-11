import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Email utility module using Gmail SMTP (Nodemailer).
 * Gmail 계정/앱 비밀번호 + 이메일 템플릿은 DB(site_settings)에서 읽어옴.
 * 관리자 설정 페이지에서 설정 가능.
 */

let cachedSettings = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1분 캐시

/**
 * DB에서 이메일 관련 설정 전체 조회 (캐싱)
 */
async function getEmailSettings() {
  if (cachedSettings && Date.now() - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("site_settings")
      .select("key, value")
      .in("key", [
        "email_provider", "gmail_user", "gmail_app_password", "email_sender_name",
        "email_template_otp_subject", "email_template_otp_body",
        "email_template_submission_subject", "email_template_submission_body",
      ]);

    if (!data || data.length === 0) return null;

    const settings = {};
    data.forEach((row) => {
      let val = row.value;
      if (typeof val === "string") {
        try { val = JSON.parse(val); } catch { /* keep as-is */ }
      }
      settings[row.key] = val;
    });

    cachedSettings = settings;
    cacheTime = Date.now();
    return settings;
  } catch (err) {
    console.error("Failed to fetch email settings:", err.message);
    return null;
  }
}

/**
 * Gmail SMTP transporter 생성
 */
async function getTransporter() {
  const settings = await getEmailSettings();
  if (!settings || !settings.gmail_user || !settings.gmail_app_password) {
    console.warn("Gmail 설정 미완료 — 이메일이 발송되지 않습니다.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: settings.gmail_user,
      pass: settings.gmail_app_password,
    },
  });
}

/**
 * 발신자 주소 생성
 */
async function getSenderAddress() {
  const settings = await getEmailSettings();
  if (!settings) return null;
  const name = settings.email_sender_name || "교육 공공데이터 AI활용대회";
  const email = settings.gmail_user;
  return `"${name}" <${email}>`;
}

/**
 * 템플릿 변수 치환
 * {{OTP_CODE}}, {{SUBMISSION_NO}}, {{TITLE}} 등의 변수를 실제 값으로 교체
 */
function applyTemplate(template, variables) {
  if (!template) return template;
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

// ── 기본 템플릿 ──

const DEFAULT_OTP_SUBJECT = "[제8회 교육 공공데이터 AI활용대회] 이메일 인증번호 안내";
const DEFAULT_OTP_BODY = `<div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',sans-serif;background:#f8fafc;">
  <!-- 외곽 래퍼 -->
  <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin:20px;">

    <!-- 헤더 -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#a855f7 100%);padding:48px 40px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);padding:8px 20px;border-radius:20px;margin-bottom:16px;">
        <span style="color:#fff;font-size:12px;font-weight:600;letter-spacing:2px;">AI 이용권 인증</span>
      </div>
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px 0;font-weight:800;line-height:1.3;">제8회 교육 공공데이터<br>AI활용 경진대회</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">이메일 본인 인증을 진행해주세요</p>
    </div>

    <!-- 본문 -->
    <div style="padding:40px;">

      <!-- 인사말 -->
      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 28px 0;">
        안녕하세요! 😊<br>
        AI 이용권 신청을 위한 <strong style="color:#4f46e5;">이메일 인증번호</strong>를 보내드립니다.
      </p>

      <!-- 인증번호 카드 -->
      <div style="background:linear-gradient(145deg,#eef2ff 0%,#f5f3ff 100%);border:2px solid #c7d2fe;border-radius:20px;padding:36px 30px;text-align:center;margin:0 0 28px 0;">
        <p style="font-size:12px;color:#6366f1;margin:0 0 12px 0;font-weight:700;text-transform:uppercase;letter-spacing:3px;">인증번호</p>
        <div style="background:#ffffff;border-radius:12px;padding:20px;display:inline-block;box-shadow:0 2px 8px rgba(99,102,241,0.12);">
          <p style="font-size:46px;font-weight:900;letter-spacing:12px;color:#4f46e5;margin:0;font-family:'Courier New',monospace;">{{OTP_CODE}}</p>
        </div>
      </div>

      <!-- 만료 경고 -->
      <div style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-left:4px solid #f59e0b;padding:14px 18px;border-radius:0 12px 12px 0;margin:0 0 28px 0;display:flex;align-items:center;">
        <span style="font-size:20px;margin-right:10px;">⏱️</span>
        <p style="font-size:13px;color:#92400e;margin:0;line-height:1.5;">이 인증번호는 <strong>5분 후에 만료</strong>됩니다.<br>시간 내에 인증을 완료해주세요.</p>
      </div>

      <!-- 안내 단계 -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin:0 0 28px 0;">
        <p style="font-size:13px;font-weight:700;color:#374151;margin:0 0 14px 0;">📋 인증 방법</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;width:28px;">
              <div style="background:#4f46e5;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;">1</div>
            </td>
            <td style="padding:6px 0;font-size:13px;color:#6b7280;line-height:1.5;">이용권 신청 페이지로 돌아갑니다</td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#4f46e5;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;">2</div>
            </td>
            <td style="padding:6px 0;font-size:13px;color:#6b7280;line-height:1.5;">인증번호 입력란에 위 번호를 입력합니다</td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#4f46e5;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;">3</div>
            </td>
            <td style="padding:6px 0;font-size:13px;color:#6b7280;line-height:1.5;">인증 완료 후 이용권 신청을 진행합니다</td>
          </tr>
        </table>
      </div>

      <!-- 보안 안내 -->
      <div style="background:#fef2f2;border-radius:10px;padding:14px 18px;margin:0 0 20px 0;">
        <p style="font-size:12px;color:#991b1b;margin:0;line-height:1.6;">
          🔒 <strong>보안 안내:</strong> 본인이 요청하지 않았다면 이 이메일을 무시해주세요. 인증번호는 타인에게 절대 공유하지 마세요.
        </p>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:12px;color:#9ca3af;margin:0 0 4px 0;">교육부 · 한국교육학술정보원</p>
      <p style="font-size:11px;color:#d1d5db;margin:0;">제8회 교육 공공데이터 AI활용 경진대회</p>
    </div>

  </div>
</div>`;

const DEFAULT_SUBMISSION_SUBJECT = "[제8회 교육 공공데이터 AI활용대회] 작품 접수 완료 ({{SUBMISSION_NO}})";
const DEFAULT_SUBMISSION_BODY = `<div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#ffffff;">
  <!-- 헤더 -->
  <div style="background:linear-gradient(135deg,#4361ee 0%,#7c3aed 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;font-weight:700;">제8회 교육 공공데이터 AI활용 경진대회</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">🎉 작품 접수 완료</p>
  </div>
  <!-- 본문 -->
  <div style="padding:40px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 25px 0;">안녕하세요,<br>작품이 <strong>정상적으로 접수</strong>되었습니다. 아래 내용을 확인해주세요.</p>
    <!-- 접수 정보 -->
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:24px;margin:0 0 25px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:100px;">접수번호</td>
          <td style="padding:8px 0;font-size:16px;font-weight:700;color:#059669;font-family:'Courier New',monospace;">{{SUBMISSION_NO}}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid #d1fae5;">작품 제목</td>
          <td style="padding:8px 0;font-size:15px;font-weight:600;color:#333;border-top:1px solid #d1fae5;">{{TITLE}}</td>
        </tr>
      </table>
    </div>
    <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 16px;border-radius:0 8px 8px 0;margin:0 0 25px 0;">
      <p style="font-size:13px;color:#1e40af;margin:0 0 4px 0;font-weight:600;">📋 안내사항</p>
      <p style="font-size:13px;color:#1e40af;margin:0;line-height:1.6;">• 접수번호와 비밀번호로 접수 내역 <strong>조회 및 수정</strong>이 가능합니다.<br>• 마감일 이전까지 수정이 가능하며, 마감 후에는 변경이 불가합니다.<br>• 심사 결과는 대회 홈페이지에서 확인하실 수 있습니다.</p>
    </div>
    <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0;">대회 참여에 감사드립니다. 좋은 결과가 있기를 바랍니다!</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />
    <p style="font-size:12px;color:#d1d5db;text-align:center;margin:0;">교육부 · 한국교육학술정보원 · 제8회 교육 공공데이터 AI활용 경진대회</p>
  </div>
</div>`;

/**
 * Send OTP verification email
 */
export async function sendOTPEmail({ to, otpCode }) {
  const transporter = await getTransporter();
  if (!transporter) return;

  const from = await getSenderAddress();
  const settings = await getEmailSettings();

  const subject = applyTemplate(
    settings?.email_template_otp_subject || DEFAULT_OTP_SUBJECT,
    { OTP_CODE: otpCode }
  );
  const html = applyTemplate(
    settings?.email_template_otp_body || DEFAULT_OTP_BODY,
    { OTP_CODE: otpCode }
  );

  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`OTP email sent to ${to}`);
  } catch (err) {
    console.error("OTP email send error:", err.message);
  }
}

/**
 * Send submission confirmation email
 */
export async function sendSubmissionConfirmation({ to, submissionNo, title }) {
  const transporter = await getTransporter();
  if (!transporter) return;

  const from = await getSenderAddress();
  const settings = await getEmailSettings();

  const vars = { SUBMISSION_NO: submissionNo, TITLE: title };

  const subject = applyTemplate(
    settings?.email_template_submission_subject || DEFAULT_SUBMISSION_SUBJECT,
    vars
  );
  const html = applyTemplate(
    settings?.email_template_submission_body || DEFAULT_SUBMISSION_BODY,
    vars
  );

  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`Submission confirmation sent to ${to}`);
  } catch (err) {
    console.error("Submission confirmation email error:", err.message);
  }
}

/**
 * 테스트 이메일 발송
 */
export async function sendTestEmail({ to }) {
  const transporter = await getTransporter();
  if (!transporter) throw new Error("Gmail 설정이 완료되지 않았습니다.");

  const from = await getSenderAddress();

  await transporter.sendMail({
    from,
    to,
    subject: "[테스트] 이메일 발송 설정 확인",
    html: `<div style="max-width:500px;margin:0 auto;font-family:'Apple SD Gothic Neo',sans-serif;padding:30px;">
      <h2 style="color:#4361ee;margin-bottom:20px;">✅ 이메일 설정 성공!</h2>
      <p>Gmail SMTP를 통한 이메일 발송이 정상적으로 작동합니다.</p>
      <p style="font-size:13px;color:#bbb;">이 메일은 관리자 설정 페이지에서 테스트 발송된 메일입니다.</p>
    </div>`,
  });

  return true;
}

/**
 * 기본 템플릿 내보내기 (설정 페이지에서 사용)
 */
export const DEFAULT_TEMPLATES = {
  otp: { subject: DEFAULT_OTP_SUBJECT, body: DEFAULT_OTP_BODY },
  submission: { subject: DEFAULT_SUBMISSION_SUBJECT, body: DEFAULT_SUBMISSION_BODY },
};

/**
 * 캐시 초기화 (설정 변경 후 호출)
 */
export function clearEmailSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
