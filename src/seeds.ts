// import { config } from 'dotenv';
// import 'reflect-metadata';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { runSeeders, SeederOptions } from 'typeorm-extension';
// import { Classroom } from './classroom/classroom.entity';
// import { ClassroomSeeder } from './db/seeding/seeds/classroomSeed';
// import { Inventary_typeSeeder } from './db/seeding/seeds/inventari_type.seeds';
// import { InventariSeeder } from './db/seeding/seeds/inventariSeed';
// import { IssueSeeder } from './db/seeding/seeds/issues.seeder';
// import { StatusSeeder } from './db/seeding/seeds/statusSeed';
// import { UserSeeder } from './db/seeding/seeds/users.seeder';
// import { Inventari_type } from './imagen/imagen.entity';
// import { Inventari } from './inventari/inventari.entity';
// import { IssueConversationEntity } from './localidad/localidad.entity';
// import { Status } from './provincia/provinvia.entity';
// import { Issue } from './puja/puja.entity';
// import { User } from './users/users.entity';
// config();

// const options: DataSourceOptions & SeederOptions = {
//   type: 'mariadb',
//   host: 'database',
//   port: 3306,
//   username: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,

//   entities: [
//     Inventari,
//     Inventari_type,
//     Issue,
//     IssueConversationEntity,
//     User,
//     Status,
//     Classroom,
//   ],
//   seeds: [
//     StatusSeeder,
//     Inventary_typeSeeder,
//     UserSeeder,
//     ClassroomSeeder,
//     InventariSeeder,
//     IssueSeeder,
//   ],
// };

// const dataSource = new DataSource(options);

// dataSource
//   .initialize()
//   .then(async () => {
//     await dataSource.synchronize(true);
//     await runSeeders(dataSource);
//     process.exit();
//   })
//   .catch((error) => console.log('Error initializing data source', error));
