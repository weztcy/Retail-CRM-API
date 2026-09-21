export interface CreateAuditLogInput {

  userId: string;

  action: string;

  module: string;

  description?: string;

  ipAddress?: string;

}