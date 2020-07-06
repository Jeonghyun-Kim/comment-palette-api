import {
  Model, Table, Column,
  DataType,
  CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'signature',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})

export class Signature extends Model<Signature> {
  @Column(DataType.TEXT)
  url!: string;

  @Column(DataType.TEXT)
  content?: string;

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
