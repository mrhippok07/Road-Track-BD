# Road Track BD 🛣️🇧🇩

[English Version Below]

## বাংলা বিবরণ (Bengali Description)

**Road Track BD** একটি নাগরিক সেবা প্ল্যাটফর্ম যা বাংলাদেশের রাস্তাঘাট, ব্রিজ এবং অন্যান্য অবকাঠামোগত সমস্যা সরাসরি ম্যাপে রিপোর্ট করার সুবিধা দেয়। এটি সাধারণ নাগরিক, স্বেচ্ছাসেবক এবং সরকারি কর্তৃপক্ষের মধ্যে একটি স্বচ্ছ সেতু হিসেবে কাজ করে।

### 🌟 প্রধান বৈশিষ্ট্যসমূহ:
- **লাইভ স্যাটেলাইট ম্যাপ:** রিয়েল-টাইম গুগল ম্যাপে সব রিপোর্ট লাল (বাকি), নীল (চলছে) এবং সবুজ (সম্পন্ন) ডট হিসেবে দেখা যায়।
- **৩০ দিনের অটো-ডিলিট:** সিস্টেমকে সচল ও পরিষ্কার রাখতে যেকোনো রিপোর্ট ৩০ দিন পর স্বয়ংক্রিয়ভাবে মুছে যায়।
- **নিরাপদ রেজিস্ট্রেশন:** স্প্যাম রোধে ১০ সংখ্যার এনআইডি (NID) নম্বর ও জন্ম তারিখ ব্যবহার বাধ্যতামূলক।
- **চর এলাকা উন্নয়ন:** বিশেষ করে চরাঞ্চলের জন্য আলাদা রিপোর্টিং ব্যবস্থা (স্কুল, রাস্তা, বাঁধ ইত্যাদি)।
- **পাসওয়ার্ড রিসেট:** ফোন নম্বর ও এনআইডি ভেরিফিকেশনের মাধ্যমে সহজেই পাসওয়ার্ড পরিবর্তন করা সম্ভব।

### 🛠️ টেকনিক্যাল সেটআপ (ম্যানুয়াল)
১. `npm install` দিয়ে প্যাকেজগুলো ইন্সটল করুন।
২. একটি `.env` ফাইল তৈরি করুন এবং নিচের তথ্যগুলো দিন:
   ```env
   PORT=3000
   GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
   JWT_SECRET=any_strong_key_here
   ```
৩. `npm start` দিয়ে প্রজেক্ট রান করুন।

---

## English Description

**Road Track BD** is a citizen service platform designed to monitor and report road damages, broken bridges, and other infrastructure issues in Bangladesh. It bridges the gap between citizens, volunteers, and government authorities.

### 🌟 Key Features:
- **Live Satellite Map:** Real-time visualization of reports using Red (Pending), Blue (Repairing), and Green (Done) markers.
- **30-Day Auto-Cleanup:** Reports are automatically cleared after 30 days to keep the system updated.
- **Verified Registration:** Mandatory 10-digit NID and Date of Birth to prevent fake reports.
- **Chor Area Focus:** Dedicated reporting category for remote "Chor" areas (Schools, Embankments, Roads, etc.).
- **NID-based Password Reset:** Secure account recovery using Phone & NID verification.

### 🛠️ Manual Setup
1. Run `npm install` to set up dependencies.
2. Create a `.env` file and add:
   ```env
   PORT=3000
   GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
   JWT_SECRET=any_strong_key_here
   ```
3. Run `npm start` to launch the application.

---
**Developed by: Mr. Hippok07** 🇧🇩  
[Support the Project](https://www.buymeacoffee.com/YOUR_USERNAME)