const { withAndroidColors, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withCustomPlugin(config) {
  // تصفير وتجاوز خطأ الألوان في الأندرويد
  config = withAndroidColors(config, (config) => {
    config.modResults = config.modResults || { resources: { color: [] } };
    return config;
  });

  // حذف مجلد الأندرويد المؤقت القديم لضمان بناء نظيف 100%
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const androidDir = path.join(config.modRequest.projectRoot, 'android');
      if (fs.existsSync(androidDir)) {
        fs.rmSync(androidDir, { recursive: true, force: true });
      }
      return config;
    },
  ]);

  return config;
};

