import { Router } from '@classes/router.class';
import { Container } from '@config/container.config';
import { Guard } from '@middlewares/guard.middleware';
import { ROLES } from '@enums/role.enum';

export class HarvestRouter extends Router {
  constructor() {
    super();
  }

  define() {
    this.router
      .route('/table')
      .get(
        Guard.authorize([ROLES.read, ROLES.admin, ROLES.user]),
        Container.resolve('HarvestController').getTable
      );
    this.router
      .route('/table')
      .post(
        Guard.authorize([ROLES.read, ROLES.admin, ROLES.user]),
        Container.resolve('HarvestController').getTable
      );
    this.router
      .route('/status')
      .patch(
        Guard.authorize([ROLES.admin, ROLES.user]),
        Container.resolve('HarvestController').updateStatus
      );
    this.router
      .route('/date')
      .patch(
        Guard.authorize([ROLES.admin, ROLES.user]),
        Container.resolve('HarvestController').updateDate
      );
  }
}
