import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import dotenv from 'dotenv';
import './models/Base.js';
import './models/User.js';
import Base from './models/Base.js';

dotenv.config();

async function createAdminUser() {
    try {
        console.log('👑 Creating admin user...');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Base.findOne({
            $or: [
                { email: 'admin@subhub.com' },
                { username: 'admin' }
            ]
        });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists:');
            console.log(`Email: ${existingAdmin.email}, Username: ${existingAdmin.username}, Role: ${existingAdmin.role}`);
            mongoose.connection.close();
            return;
        }

        // Create admin user
        const hashedPassword = await hash('admin123', 10);

        const adminUser = new Base({
            email: 'admin@subhub.com',
            password: hashedPassword,
            username: 'admin',
            role: 'admin'
        });

        await adminUser.save();
        console.log('🎉 Admin user created successfully!');
        console.log('\n📋 Admin Login Credentials:');
        console.log('Email: admin@subhub.com');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Role: admin');
        console.log('\n💡 You can now login to admin dashboard at /dashboard');

        mongoose.connection.close();
        console.log('\n🔒 Connection closed');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
