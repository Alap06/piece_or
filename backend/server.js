require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-create admin if not exists
  const { ensureAdmin } = require('./seeds/createAdmin');
  await ensureAdmin();

  app.listen(PORT, () => {
    console.log('');
    console.log('══════════════════════════════════════════');
    console.log('  ✨ Pièces d\'Or de Mahdia — API Server');
    console.log(`  🚀 Running on http://localhost:${PORT}`);
    console.log(`  📦 Environment: ${process.env.NODE_ENV}`);
    console.log('══════════════════════════════════════════');
    console.log('');
  });
};

startServer().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});
