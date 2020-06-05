import {
  Model, Table, Column,
  IsEmail, Unique,
  CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'subscription',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})

export class Subscription extends Model<Subscription> {
  @Unique
  @IsEmail
  @Column
  email!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;
}
