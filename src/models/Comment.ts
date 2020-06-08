import {
  Model, Table, Column, DefaultScope, Scopes,
  Length,
  CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

@DefaultScope({
  attributes: ['id', 'name', 'content', 'createdAt', 'updatedAt'],
})

@Scopes({
  withPassword: {
    attributes: ['id', 'name', 'password', 'content', 'createdAt', 'updatedAt'],
  },
})

@Table({
  tableName: 'comment',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})

export class Comment extends Model<Comment> {
  @Length({ min: 2, max: 20 })
  @Column
  name!: string;

  @Column
  password!: string;

  @Length({ min: 3, max: 2000 })
  @Column
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
