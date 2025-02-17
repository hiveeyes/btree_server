import { ExtModel } from '@models/base.model';
import { Hive } from '@models/hive.model';
import { User } from '@models/user.model';
import { HarvestType } from '@models/option/harvest_type.model';
import { HarvestApiary } from '@models/harvest_apiary.model';

export class Harvest extends ExtModel {
  id!: number;
  date!: Date;
  enddate!: Date;
  amount!: number;
  frames!: number;
  water!: number;
  charge!: string;
  note!: string;
  url!: string;
  done!: boolean;
  deleted!: boolean;
  edit_id!: number;

  static tableName = 'harvests';
  static idColumn = 'id';

  type?: HarvestType;
  harvest_apiary?: HarvestApiary;
  company?: Hive;
  creator?: User;
  editor?: User;

  static jsonSchema = {
    type: 'object',
    required: ['date', 'hive_id'],
    properties: {
      id: { type: 'integer' },
      date: { type: 'string', format: 'date' },
      enddate: { type: 'string', format: 'date' },
      amount: { type: 'number' },
      water: { type: 'number' },
      frames: { type: 'integer' },
      charge: { type: 'string', maxLength: 24 },
      note: { type: 'string', maxLength: 2000 },
      url: { type: 'string', maxLength: 512 },

      done: { type: 'boolean' },

      deleted: { type: 'boolean' },
      deleted_at: { type: 'string', format: 'date-time' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },

      type_id: { type: 'integer' }, // Type FK
      user_id: { type: 'integer' }, // Company FK
      bee_id: { type: 'integer' }, // Creator Bee FK
      edit_id: { type: 'integer' } // Updater Bee FK
    }
  };

  static relationMappings = () => ({
    type: {
      relation: ExtModel.HasOneRelation,
      modelClass: HarvestType,
      join: {
        from: ['harvests.type_id'],
        to: ['harvest_types.id']
      }
    },
    hive: {
      relation: ExtModel.HasOneRelation,
      modelClass: Hive,
      join: {
        from: ['harvests.hive_id'],
        to: ['hives.id']
      }
    },
    harvest_apiary: {
      relation: ExtModel.HasOneRelation,
      modelClass: HarvestApiary,
      join: {
        from: ['harvests_apiaries.harvest_id'],
        to: ['harvests.id']
      }
    },
    creator: {
      relation: ExtModel.HasOneRelation,
      modelClass: User,
      join: {
        from: ['harvests.bee_id'],
        to: ['bees.id']
      }
    },
    editor: {
      relation: ExtModel.HasOneRelation,
      modelClass: User,
      join: {
        from: ['harvests.edit_id'],
        to: ['bees.id']
      }
    }
  });
}
