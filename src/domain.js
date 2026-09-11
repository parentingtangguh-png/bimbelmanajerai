export function progress(current, baseline, target) {
  if (target <= baseline) return current >= target ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round((current - baseline) / (target - baseline) * 100)));
}
export function waLink(phone, message) {
  let number = String(phone).replace(/\D/g, '');
  if (number.startsWith('0')) number = '62' + number.slice(1);
  if (!/^\d{8,15}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function escapeHtml(value = '') { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function localDate() { return new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Jakarta', year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
