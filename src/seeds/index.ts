import { DataSource } from 'typeorm';
import { seedAccountTypes } from './account-types.seeder';
import { seedTransactionCategories } from './transaction-categories.seeder';
import { AccountType } from '../account-types/entities/account-type.entity';
import { TransactionCategory } from '../transaction_categories/entities/transaction-category.entity';
import { InvestmentType } from '../investment-types/entities/investment-type.entity';
import { seedInvestmentTypes } from './investment-types.seeder';
import { seedAccounts } from './accounts.seeder';
import { User } from '../users/entities/user.entity';
import { seedUser } from './user.seeder';
import { Account } from '../accounts/entities/account.entity';
import { Investment } from '../investments/entities/investment.entity';
import { seedInvestments } from './investments.seeder';
import { InvestmentDetails } from '../investment-details/entities/investment-details.entity';
import { seedInvestmentDetails } from './investment-details.seeder';
import { Transaction } from '../transactions/entities/transaction.entity';
import { seedTransactions } from './transactions.seeder';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: Number(process.env.TYPEORM_PORT) || 5432,
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'root',
  database: process.env.TYPEORM_DATABASE || 'finances_app',
  synchronize: true,
  entities: [
    User,
    Account,
    AccountType,
    TransactionCategory,
    InvestmentType,
    Investment,
    InvestmentDetails,
    Transaction,
  ],
});

async function runSeeds() {
  console.log('🌱 Iniciando seeders para producción...');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');
    
    // 1. Usuarios
    console.log('👤 Creando usuarios...');
    await seedUser(AppDataSource);
    
    // 2. Tipos de cuenta
    console.log('📊 Insertando tipos de cuenta...');
    await seedAccountTypes(AppDataSource);
    
    // 3. Cuentas
    console.log('🏦 Creando cuentas...');
    await seedAccounts(AppDataSource);
    
    // 4. Categorías de transacción
    console.log('🏷️ Insertando categorías de transacción...');
    await seedTransactionCategories(AppDataSource);
    
    // 5. Tipos de inversión
    console.log('💰 Insertando tipos de inversión...');
    await seedInvestmentTypes(AppDataSource);
    
    // 6. Inversiones
    console.log('📈 Creando inversiones...');
    await seedInvestments(AppDataSource);
    
    // 7. Detalles de inversión
    console.log('📋 Insertando detalles de inversión...');
    await seedInvestmentDetails(AppDataSource);
    
    // 8. Transacciones (al final, para asegurar claves foráneas)
    console.log('💳 Creando transacciones...');
    await seedTransactions(AppDataSource);
    
    console.log('✅ Todos los seeders ejecutados exitosamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log('🎉 Database seeding completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal en seeders:', error);
      process.exit(1);
    });
}
