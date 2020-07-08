import {
  Model, Table, Column, Default, DefaultScope,
  CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

@DefaultScope({
  attributes: [
    'intro',
    'main1',
    'main2',
    'main3',
    'main4',
    'main5',
    'video',
    'menu',
    'list',
    'viewingRoom',
    'history',
    'guest',
  ],
})

@Table({
  tableName: 'hitCount',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
})

export class HitCount extends Model<HitCount> {
  @Default(0)
  @Column
  intro!: number;

  @Default(0)
  @Column
  main1!: number;

  @Default(0)
  @Column
  main2!: number;

  @Default(0)
  @Column
  main3!: number;

  @Default(0)
  @Column
  main4!: number;

  @Default(0)
  @Column
  main5!: number;

  @Default(0)
  @Column
  video!: number;

  @Default(0)
  @Column
  menu!: number;

  @Default(0)
  @Column
  list!: number;

  @Default(0)
  @Column
  viewingRoom!: number;

  @Default(0)
  @Column
  history!: number;

  @Default(0)
  @Column
  guest!: number;

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
