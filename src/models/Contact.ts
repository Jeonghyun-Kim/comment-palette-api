import {
  Model, Table, Column,
  IsEmail, Length, DataType,
  CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'contact',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})

export class Contact extends Model<Contact> {
  @Column
  index!: number;

  @Length({ min: 2, max: 20 })
  @Column
  name!: string;

  @IsEmail
  @Column
  email!: string;

  @Column
  phone?: string;

  @Length({ min: 3, max: 1000 })
  @Column(DataType.TEXT)
  content!: string;

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
