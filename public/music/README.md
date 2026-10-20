# Nhạc nền

1. Chép file nhạc của bạn vào thư mục này, ví dụ `background.mp3`.
2. Mở `src/data/content.ts` và sửa:

   ```ts
   export const musicSrc: string | null = '/music/background.mp3'
   ```

Khi `musicSrc` là `null`, website tự phát một giai điệu hộp nhạc nhẹ tạo bằng Web Audio.
Nhạc chỉ bắt đầu khi người xem bấm nút "Mở món quà" hoặc nút loa — không bao giờ tự phát.
