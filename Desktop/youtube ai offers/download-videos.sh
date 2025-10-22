#!/bin/bash

# Створюємо папку для відео
mkdir -p public/videos/gambling
mkdir -p public/videos/betting
mkdir -p public/videos/e-com
mkdir -p public/videos/education
mkdir -p public/videos/products

echo "📹 Downloading gambling videos..."

# TikTok відео
yt-dlp -o "public/videos/gambling/gambling_1.mp4" "https://www.tiktok.com/@minisrtoy/video/7563036887657532684"
yt-dlp -o "public/videos/gambling/gambling_2.mp4" "https://www.tiktok.com/@moneyraincheek/video/7551359457263881528"

# YouTube Shorts
yt-dlp -o "public/videos/gambling/gambling_3.mp4" "https://www.youtube.com/shorts/KAmT0vNaMdM"
yt-dlp -o "public/videos/gambling/gambling_4.mp4" "https://www.youtube.com/shorts/_fZQUMp0xeI"
yt-dlp -o "public/videos/gambling/gambling_5.mp4" "https://www.youtube.com/shorts/YjvwuBjtkiw"
yt-dlp -o "public/videos/gambling/gambling_6.mp4" "https://www.youtube.com/shorts/sjB4tbyUWr8"
yt-dlp -o "public/videos/gambling/gambling_7.mp4" "https://www.youtube.com/shorts/cHDxVp85UZU"
yt-dlp -o "public/videos/gambling/gambling_8.mp4" "https://www.youtube.com/shorts/MixVQ_X3zqM"
yt-dlp -o "public/videos/gambling/gambling_9.mp4" "https://www.youtube.com/shorts/ecmUZwa2JG8"
yt-dlp -o "public/videos/gambling/gambling_10.mp4" "https://www.youtube.com/shorts/g-4EjiFuWmE"
yt-dlp -o "public/videos/gambling/gambling_11.mp4" "https://www.youtube.com/shorts/PdVCMbdyY3Q"

echo "✅ Gambling videos downloaded!"

echo "📹 Downloading e-com videos..."

# YouTube Shorts e-com
yt-dlp -o "public/videos/e-com/ecom_1.mp4" "https://www.youtube.com/shorts/Q3piqm4m9kY"
yt-dlp -o "public/videos/e-com/ecom_2.mp4" "https://youtube.com/shorts/Y-broQNjzk4"
yt-dlp -o "public/videos/e-com/ecom_3.mp4" "https://www.tiktok.com/@thesarahsfinds/video/7549547146224176415"
yt-dlp -o "public/videos/e-com/ecom_4.mp4" "https://www.youtube.com/shorts/xjLmDP1X-Zk"
yt-dlp -o "public/videos/e-com/ecom_5.mp4" "https://www.youtube.com/shorts/xRJ9xkpyuaE"
yt-dlp -o "public/videos/e-com/ecom_6.mp4" "https://www.youtube.com/shorts/_pLPhynA-Bk"
yt-dlp -o "public/videos/e-com/ecom_7.mp4" "https://www.youtube.com/shorts/sQY8lFJ1p2c"
yt-dlp -o "public/videos/e-com/ecom_8.mp4" "https://www.youtube.com/shorts/RbjDFqvwm1k"
yt-dlp -o "public/videos/e-com/ecom_9.mp4" "https://www.youtube.com/shorts/yx8KRttal7M"

echo "✅ E-com videos downloaded!"

echo "📹 Downloading betting videos..."

# YouTube Shorts betting
yt-dlp -o "public/videos/betting/betting_1.mp4" "https://www.youtube.com/shorts/IC5VH3tcUpE"
yt-dlp -o "public/videos/betting/betting_2.mp4" "https://www.youtube.com/shorts/6P3kVIcPm1I"
yt-dlp -o "public/videos/betting/betting_3.mp4" "https://www.youtube.com/shorts/pEq7kUnBf8s"
yt-dlp -o "public/videos/betting/betting_4.mp4" "https://www.youtube.com/shorts/8C2aMGdjqqI"
yt-dlp -o "public/videos/betting/betting_5.mp4" "https://www.youtube.com/shorts/P1DzPHGC-KY"
yt-dlp -o "public/videos/betting/betting_6.mp4" "https://www.youtube.com/shorts/P49NRn8tR7o"

echo "✅ Download complete!"
echo "📁 Videos saved to: public/videos/gambling/, public/videos/e-com/, and public/videos/betting/"

