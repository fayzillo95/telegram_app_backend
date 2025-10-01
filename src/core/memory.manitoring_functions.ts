// memory-analyzer.js
// Deploy bo'lgandan keyin RAM sarfi va TOP 10 processlarni ko'rsatish (ES Module)

import { execSync } from 'child_process';
import os from 'os';

/**
 * Deploy bo'lgandan keyin xotira holatini tekshirish asosiy funksiya
 */
export function checkMemoryAfterDeploy() {
  console.log('\n🚀 ===== DEPLOY DAN KEYIN XOTIRA TAHLILI ===== 🚀');
  console.log(`🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`);
  console.log(`🌐 Muhit: ${process.env.NODE_ENV || 'production'}`);
  console.log('==================================================\n');

  try {
    // 1. Joriy dastur xotira sarfi
    showAppMemoryUsage();

    // 2. Tizim xotira umumiy holat
    showSystemMemoryOverview();

    // 3. Eng ko'p xotira ishlatuvchi 10 ta jarayon
    showTop10RamConsumers();

    // 4. Konteyner ma'lumotlari (Docker bo'lsa)
    showContainerInfo();

    console.log('✅ ===== XOTIRA TAHLILI YAKUNLANDI ===== ✅\n');

  } catch (error) {
    console.error('❌ Xotira tahlilida xatolik:', error.message);
  }
}

/**
 * Joriy dastur xotira sarfini ko'rsatish
 */
export function showAppMemoryUsage() {
  const memUsage = process.memoryUsage();
  const formatMB = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;

  console.log('📱 === DASTUR XOTIRA SARFI ===');
  console.log(`🆔 Jarayon raqami: ${process.pid}`);
  console.log(`💾 RSS (Fizik xotira): ${formatMB(memUsage.rss)} MB`);
  console.log(`🧠 Heap ishlatilgan: ${formatMB(memUsage.heapUsed)} MB`);
  console.log(`📊 Heap jami: ${formatMB(memUsage.heapTotal)} MB`);
  console.log(`🔗 Tashqi C++ obyektlar: ${formatMB(memUsage.external)} MB`);
  console.log(`📋 Array Bufferlar: ${formatMB(memUsage.arrayBuffers)} MB`);
  console.log(`📈 Heap foydalanish: ${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1)}%`);
  console.log('===================================\n');
}

/**
 * Tizim xotira umumiy holatini ko'rsatish
 */
export function showSystemMemoryOverview() {
  try {
    const formatMB = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    console.log('💾 === TIZIM XOTIRA HOLATI ===');
    console.log(`📊 Jami RAM: ${formatMB(totalMem)} MB`);
    console.log(`🔴 Ishlatilgan RAM: ${formatMB(usedMem)} MB (${((usedMem / totalMem) * 100).toFixed(1)}%)`);
    console.log(`🟢 Bo'sh RAM: ${formatMB(freeMem)} MB (${((freeMem / totalMem) * 100).toFixed(1)}%)`);
    console.log(`✅ Dastur uchun mavjud: ${formatMB(freeMem)} MB`);
    console.log('===============================\n');
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * Eng ko'p RAM ishlatuvchi 10 ta jarayonni ko'rsatish
 */
export function showTop10RamConsumers() {
  console.log('🔥 === ENG KO\'P RAM ISHLATUVCHI 10 TA JARAYON ===');

  try {
    if (process.platform === 'linux') {
      // Linux (Render.com server)
      console.log('🐧 Platforma: Linux Server\n');

      // Jadval sarlavhasi
      console.log('%-8s %-8s %-8s %-10s %s', 'PID', 'RAM%', 'CPU%', 'RAM(MB)', 'BUYRUQ');
      console.log(''.padEnd(65, '-'));

      const output = execSync('ps aux --sort=-%mem --no-headers | head -10', { encoding: 'utf8' });
      const lines = output.trim().split('\n');

      lines.forEach((line, index) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 11) {
          const pid = parts[1];
          const memPercent = parts[3];
          const cpuPercent = parts[2];
          const rss = Math.round(parseInt(parts[5]) / 1024); // KB dan MB ga
          const command = parts.slice(10).join(' ').substring(0, 35);

          // Ranglar qo'shish
          const prefix = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣ `;
          console.log('%s %-7s %-8s %-8s %-10s %s', prefix, pid, memPercent + '%', cpuPercent + '%', rss + 'MB', command);
        }
      });

    } else if (process.platform === 'darwin') {
      // macOS
      console.log('🍎 Platforma: macOS\n');
      console.log('%-8s %-8s %s', 'RAM%', 'PID', 'BUYRUQ');
      console.log(''.padEnd(50, '-'));

      const output = execSync('ps -A -o %mem,pid,comm | sort -nr | head -10', { encoding: 'utf8' });
      const lines = output.trim().split('\n').slice(1); // Sarlavhani o'tkazib yuborish

      lines.forEach((line, index) => {
        const prefix = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣ `;
        console.log('%s %s', prefix, line);
      });

    } else {
      // Windows yoki boshqa platformalar
      console.log('🪟 Platforma: Boshqa (Cheklangan ma\'lumot)\n');
      console.log(`🔍 Joriy Node.js jarayoni: PID ${process.pid}`);
      console.log(`📛 Jarayon nomi: ${process.title}`);
      console.log(`💾 Xotira sarfi: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`);
    }

  } catch (error) {
    console.log('❌ Jarayonlar ro\'yxatini olishda xatolik:', error.message);
    console.log('📋 Faqat joriy Node.js jarayon ma\'lumoti:');
    console.log(`🆔 Jarayon raqami: ${process.pid}`);
    console.log(`📛 Jarayon sarlavhasi: ${process.title}`);
    console.log(`💾 Xotira sarfi: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`);
  }

  console.log('===============================================\n');
}

/**
 * Konteyner ma'lumotlarini ko'rsatish (Docker/Render)
 */
export function showContainerInfo() {
  console.log('🐳 === KONTEYNER MA\'LUMOTLARI ===');

  try {
    // Konteyner xotira cheklovini tekshirish
    const memLimitPath = '/sys/fs/cgroup/memory/memory.limit_in_bytes';
    const memUsagePath = '/sys/fs/cgroup/memory/memory.usage_in_bytes';

    try {
      const memLimit = execSync(`cat ${memLimitPath} 2>/dev/null`, { encoding: 'utf8' }).trim();
      const memUsage = execSync(`cat ${memUsagePath} 2>/dev/null`, { encoding: 'utf8' }).trim();

      if (memLimit && memUsage && memLimit !== '' && memUsage !== '') {
        const limitMB = Math.round(parseInt(memLimit) / 1024 / 1024);
        const usageMB = Math.round(parseInt(memUsage) / 1024 / 1024);

        console.log('🏃‍♂️ Konteyner ichida ishlayapti (Docker/Render)');
        console.log(`📏 Konteyner xotira chegarasi: ${limitMB} MB`);
        console.log(`📊 Konteyner xotira sarfi: ${usageMB} MB`);
        console.log(`📈 Konteyner foydalanish: ${((usageMB / limitMB) * 100).toFixed(1)}%`);
        console.log(`✅ Konteynerde bo'sh: ${limitMB - usageMB} MB`);
      } else {
        console.log('❌ Konteyner ichida emas yoki cgroup ma\'lumoti yo\'q');
      }
    } catch (cgroupError) {
      console.log('❌ Konteyner ichida emas yoki cgroup kirish imkoni yo\'q');
    }

    // Muhit o'zgaruvchilari
    console.log(`\n📊 Muhit ma'lumotlari:`);
    console.log(`🟢 Node.js versiyasi: ${process.version}`);
    console.log(`🖥️  Platforma: ${process.platform} ${process.arch}`);
    console.log(`⚙️  CPU yadrolar soni: ${os.cpus().length}`);
    console.log(`🕒 Tizim ishlash vaqti: ${Math.round(os.uptime() / 3600)}s ${Math.round((os.uptime() % 3600) / 60)}d`);

    // Load average (Linux/macOS uchun)
    try {
      const loadAvg = os.loadavg();
      console.log(`📈 Tizim yuklanganligi:`);
      console.log(`   1 daqiqa: ${loadAvg[0].toFixed(2)}`);
      console.log(`   5 daqiqa: ${loadAvg[1].toFixed(2)}`);
      console.log(`   15 daqiqa: ${loadAvg[2].toFixed(2)}`);
    } catch (loadError) {
      console.log('📈 Tizim yuklanganlik ma\'lumoti mavjud emas');
    }

  } catch (error) {
    console.log('❌ Konteyner ma\'lumoti mavjud emas:', error.message);
  }

  console.log('==============================\n');
}

/**
 * Qisqa xotira tekshiruv (tez ko'rish uchun)
 */
export function quickMemoryCheck() {
  const memUsage = process.memoryUsage();
  const formatMB = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  console.log(`\n🚀 Dastur xotirasi: ${formatMB(memUsage.rss)} MB | 🆓 Bo'sh tizim RAM: ${formatMB(freeMem)} MB | 📊 Jami RAM: ${formatMB(totalMem)} MB\n`);
}

/**
 * Xotira ogohlantirish tizimi
 */
export function setupMemoryAlert(thresholdMB = 500, intervalMs = 30000) {
  console.log(`🚨 Xotira ogohlantiruv tizimi yoqildi (chegara: ${thresholdMB} MB)`);

  setInterval(() => {
    const memUsage = process.memoryUsage();
    const rssInMB = Math.round(memUsage.rss / 1024 / 1024);

    if (rssInMB > thresholdMB) {
      console.warn(`\n⚠️  YUQORI XOTIRA SARFI OGOHLANTIRUVI!`);
      console.warn(`💾 Joriy sarfi: ${rssInMB} MB (Chegara: ${thresholdMB} MB)`);
      console.warn(`📊 Heap: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
      console.warn(`🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}\n`);

      // Qisqa TOP processlar
      try {
        if (process.platform === 'linux') {
          console.warn('🔥 TOP 5 xotira ishlatuvchi:');
          const output = execSync('ps aux --sort=-%mem --no-headers | head -5 | awk \'{print $1" "$3"% "$4"% "$11}\'', { encoding: 'utf8' });
          console.warn(output);
        }
      } catch (error) {
        console.warn('TOP processlarni ko\'rsatishda xatolik');
      }
    }
  }, intervalMs);
}

// Default export
export default {
  checkMemoryAfterDeploy,
  quickMemoryCheck,
  showAppMemoryUsage,
  showSystemMemoryOverview,
  showTop10RamConsumers,
  showContainerInfo,
  setupMemoryAlert
};

// Agar fayl to'g'ridan-to'g'ri ishga tushirilsa