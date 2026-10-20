/**
 * Toàn bộ nội dung chữ của website nằm ở đây.
 * Muốn đổi lời chúc, tên người nhận hay người gửi — chỉ cần sửa file này.
 */

import tulipImg from '../assets/flowers/tulip.jpg'
import roseImg from '../assets/flowers/rose.jpg'
import peonyImg from '../assets/flowers/peony.jpg'

export const intro = {
  eyebrow: 'A SPECIAL DAY FOR YOU',
  title: 'Chúc Mừng Ngày 20/10',
  script: 'Dành tặng những điều tuyệt vời nhất',
  button: 'Mở món quà của bạn',
}

export const wish = {
  eyebrow: 'Một tấm thiệp nhỏ',
  title: 'Gửi đến những người phụ nữ tuyệt vời',
  greeting: 'Thân gửi bạn,',
  paragraphs: [
    'Chúc mừng ngày Phụ nữ Việt Nam 20/10! Chúc bạn luôn xinh đẹp, vui vẻ, hạnh phúc và gặp thật nhiều điều may mắn trong cuộc sống.',
    'Mong rằng mỗi ngày của bạn đều tràn ngập tiếng cười, luôn có người yêu thương, quan tâm và ở bên những lúc bạn cần.',
    'Chúc bạn mãi rạng rỡ, tự tin và luôn là phiên bản tuyệt vời nhất của chính mình. 💐',
  ],
  signature: 'Với tất cả sự trân trọng',
  sender: 'Người luôn quý mến bạn',
}

export const garden = {
  eyebrow: 'Vườn hoa tháng Mười',
  title: 'Mỗi đóa hoa, một lời thương',
  hint: 'Chạm vào từng đóa hoa để nghe lời nhắn',
  flowers: [
    // Muốn đổi ảnh: thay file trong src/assets/flowers/ (giữ nguyên tên) hoặc sửa dòng import ở đầu file.
    // `focus` là vị trí lấy khung ảnh (CSS object-position).
    { kind: 'tulip', name: 'Tulip hồng', message: 'Dịu dàng là một loại sức mạnh.', image: tulipImg, focus: '50% 30%' },
    { kind: 'rose', name: 'Hồng đỏ', message: 'Bạn xứng đáng với mọi điều đẹp nhất.', image: roseImg, focus: '50% 45%' },
    { kind: 'peony', name: 'Mẫu đơn', message: 'Mong bạn luôn rạng rỡ và đủ đầy.', image: peonyImg, focus: '50% 50%' },
  ],
  button: 'Gửi thêm yêu thương',
} as const

export const finale = {
  line: 'Mong rằng mỗi ngày của bạn đều rực rỡ như những đóa hoa',
  title: "Happy Women's Day",
  date: '20.10',
}

export const footer = {
  text: 'Làm bằng tất cả sự chân thành',
  year: new Date().getFullYear(),
}

/**
 * Nhạc nền.
 * - Để `null`: website tự phát một giai điệu hộp nhạc nhẹ nhàng tạo bằng Web Audio (không cần file).
 * - Muốn dùng nhạc của bạn: chép file vào `public/music/` rồi đặt đường dẫn, ví dụ '/music/background.mp3'.
 */
export const musicSrc: string | null = null
