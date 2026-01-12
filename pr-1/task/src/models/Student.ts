import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

import User from './User';

interface StudentAttributes {
    id?: number;
    name: string;
    age: number;
    group: string;
    userId?: string;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
    public id!: number;
    public name!: string;
    public age!: number;
    public group!: string;
    public userId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Student.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    }
}, {
    sequelize,
    tableName: 'students',
    timestamps: true,
});

export default Student;
