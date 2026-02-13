/**
 * @typedef {'EventCoordinator' | 'HOD' | 'Dean' | 'InstitutionalHead' | 'AdminITC'} UserRole
 */

/**
 * @typedef {'pending' | 'hodApproved' | 'deanApproved' | 'finalApproved' | 'rejected' | 'running' | 'completed'} EventStatus
 */

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} name
 * @property {UserRole} role
 * @property {string} department
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} scheduleStart - ISO date string
 * @property {string} scheduleEnd - ISO date string
 * @property {number} participants
 * @property {string} venuePreference
 * @property {string} allocatedVenue
 * @property {ResourcesRequested} resourcesRequested
 * @property {Object} resourcesAllocated
 * @property {EventStatus} status
 * @property {string} currentLevel
 * @property {string} [rejectionReason]
 * @property {string} coordinatorId
 * @property {string} coordinatorName
 * @property {string} department
 */

/**
 * @typedef {Object} ResourcesRequested
 * @property {number} food
 * @property {string[]} equipment
 * @property {string[]} facilities
 * @property {string[]} itcServices
 */

/**
 * @typedef {Object} Venue
 * @property {string} id
 * @property {string} name
 * @property {number} capacity
 * @property {boolean} isAvailable
 */

/**
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} name
 * @property {number} total
 * @property {number} available
 * @property {'food' | 'equipment' | 'facility' | 'itc'} type
 */

export const USER_ROLES = {
    EVENT_COORDINATOR: 'EventCoordinator',
    HOD: 'HOD',
    DEAN: 'Dean',
    INSTITUTIONAL_HEAD: 'InstitutionalHead',
    ADMIN_ITC: 'AdminITC'
};

export const EVENT_STATUS = {
    PENDING: 'pending',
    HOD_APPROVED: 'hodApproved',
    DEAN_APPROVED: 'deanApproved',
    FINAL_APPROVED: 'finalApproved',
    REJECTED: 'rejected',
    RUNNING: 'running',
    COMPLETED: 'completed'
};

export const RESOURCE_TYPES = {
    FOOD: 'food',
    EQUIPMENT: 'equipment',
    FACILITY: 'facility',
    ITC: 'itc'
};
