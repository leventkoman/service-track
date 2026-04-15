export * from './customers.schema';
export * from './employee-profiles.schema';
export * from './roles.schema';
export * from './service-items.schema';
export * from './service-provider-customers.schema';
export * from './service-providers.schema';
export * from './service-request-employees.schema';
export * from './service-request-statuses.schema';
export * from './service-requests.schema';
export * from './subscription-plans.schema';
export * from './subscriptions.schema';
export * from './units.schema';
export * from './user-profiles.schema';
export * from './user-roles.schema';
export * from './user-statuses.schema';
export * from './users.schema';
export * from './vat-rates.schema';
export * from './verification-tokens.schema';
export * from '../relations'
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - phone
 *         - fullName
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         phone:
 *           type: string
 *           example: "0532 123 45 67"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: "user@example.com"
 *         fullName:
 *           type: string
 *           example: "Ahmet Yılmaz"
 *         roleId:
 *           type: string
 *           format: uuid
 *         serviceProviderId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://cdn.example.com/avatars/123.jpg"
 *         bio:
 *           type: string
 *           nullable: true
 *           example: "Full-stack developer"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "1990-05-15"
 *         address:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *         website:
 *           type: string
 *           format: uri
 *           nullable: true
 *         language:
 *           type: string
 *           example: "tr"
 *         timezone:
 *           type: string
 *           example: "Europe/Istanbul"
 *         notifications:
 *           type: boolean
 *           example: true
 *
 *     UserWithProfile:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             profile:
 *               $ref: '#/components/schemas/UserProfile'
 *
 *     ServiceRequest:
 *       type: object
 *       required:
 *         - id
 *         - serviceNumber
 *         - problemDescription
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         serviceNumber:
 *           type: string
 *           example: "SRV-000001"
 *         serviceProviderId:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           format: uuid
 *         assignedEmployeeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         problemDescription:
 *           type: string
 *           example: "Klima soğutmuyor"
 *         solutionDescription:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, assigned, in_progress, waiting_parts, completed, cancelled]
 *           example: "pending"
 *         subtotal:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 350.00
 *         taxRate:
 *           type: integer
 *           nullable: true
 *           example: 20
 *         taxAmount:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 70.00
 *         totalAmount:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 420.00
 *         startedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ServiceItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - unit
 *         - unitPrice
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         serviceRequestId:
 *           type: string
 *           format: uuid
 *         itemType:
 *           type: string
 *           enum: [product, service]
 *           example: "product"
 *         name:
 *           type: string
 *           example: "Gaz (R410A)"
 *         description:
 *           type: string
 *           nullable: true
 *         quantity:
 *           type: number
 *           format: decimal
 *           example: 2
 *         unit:
 *           type: string
 *           example: "kg"
 *         unitPrice:
 *           type: number
 *           format: decimal
 *           example: 150.00
 *         lineTotal:
 *           type: number
 *           format: decimal
 *           example: 300.00
 *
 *     Customer:
 *       type: object
 *       required:
 *         - customerType
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerType:
 *           type: string
 *           enum: [individual, corporate]
 *           example: "individual"
 *         serviceProviderId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: "Mehmet Demir"
 *         companyName:
 *           type: string
 *           nullable: true
 *         taxNumber:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           example: "0532 987 65 43"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *
 *     Error:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "User not found"
 *
 *     ValidationError:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "phone"
 *               message:
 *                 type: string
 *                 example: "Phone number is required"
 *
 *     SuccessResponse:
 *       type: object
 *       required:
 *         - success
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example: 10
 */