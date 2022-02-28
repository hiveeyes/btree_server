import { NextFunction, Response } from 'express';
import { Controller } from '@classes/controller.class';
import { checkMySQLError } from '@utils/error.util';
import { FeedTable } from '@datatables/feed.table';
import { IUserRequest } from '@interfaces/IUserRequest.interface';
import { Guard } from '@middlewares/guard.middleware';
import { ROLES } from '@enums/role.enum';
import { Feed } from '@models/feed.model';
import { map } from 'lodash';
export class FeedController extends Controller {
  constructor() {
    super();
  }

  async getTable(req: IUserRequest, res: Response, next) {
    try {
      let editor = FeedTable.table(req);

      editor.on('preRemove', (_editor, _values) => {
        Guard.authorize([ROLES.admin])(req, res, next);
      });
      editor.on('preCreate', (_editor, _values) => {
        Guard.authorize([ROLES.user, ROLES.admin])(req, res, next);
      });
      editor.on('preEdit', (_editor, _values) => {
        Guard.authorize([ROLES.user, ROLES.admin])(req, res, next);
      });

      await editor.process(req.body);
      res.locals.data = editor.data();
      next();
    } catch (e) {
      next(checkMySQLError(e));
    }
  }
  async updateStatus(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const result = await Feed.transaction(async (trx) => {
        return Feed.query(trx)
          .patch({
            edit_id: req.user.bee_id,
            done: req.body.status
          })
          .findByIds(req.body.ids)
          .leftJoinRelated('feed_apiary')
          .where('user_id', req.user.user_id);
      });
      res.locals.data = result;
      next();
    } catch (e) {
      next(checkMySQLError(e));
    }
  }
  async updateDate(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const result = await Feed.transaction(async (trx) => {
        return Feed.query(trx)
          .patch({
            edit_id: req.user.bee_id,
            date: req.body.start,
            enddate: req.body.end
          })
          .findByIds(req.body.ids)
          .leftJoinRelated('feed_apiary')
          .where('user_id', req.user.user_id);
      });
      res.locals.data = result;
      next();
    } catch (e) {
      next(checkMySQLError(e));
    }
  }

  async batchDelete(req: IUserRequest, res: Response, next: NextFunction) {
    try {
      const result = await Feed.transaction(async (trx) => {
        const res = await Feed.query(trx)
          .findByIds(req.body.ids)
          .select('id', 'deleted')
          .withGraphJoined('feed_apiary')
          .where('user_id', req.user.user_id);

        const softIds = [];
        const hardIds = [];
        map(res, (obj) => {
          if (obj.deleted) hardIds.push(obj.id);
          else softIds.push(obj.id);
        });

        if (hardIds.length > 0) await Feed.query(trx).deleteById(hardIds);
        if (softIds.length > 0)
          await Feed.query(trx)
            .patch({
              deleted: true,
              edit_id: req.user.bee_id
            })
            .findByIds(softIds);

        return res;
      });
      res.locals.data = result;
      next();
    } catch (e) {
      next(checkMySQLError(e));
    }
  }
}
