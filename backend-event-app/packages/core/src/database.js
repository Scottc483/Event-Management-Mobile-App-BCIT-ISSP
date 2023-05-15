import pg from 'pg'
const { Pool } = pg

let pool
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}

// Get all membership statuses
export async function getMembershipStatuses() {
  const res = await getPool().query(`
  SELECT * FROM membershipstatuses
  ORDER BY membership_status_id
  `)
  return res.rows
}

// Get all eligibility types
export async function getEligibilityTypes() {
  const res = await getPool().query(`
  SELECT * FROM eligibilitytypes
  ORDER BY type_id
  `)
  return res.rows
}

// Get all attendee statuses
export async function getAttendeeStatuses() {
  const res = await getPool().query(`
  SELECT * FROM attendeestatuses
  ORDER BY attendee_status_id
  `)
  return res.rows
}

// Get all attendance statuses
export async function getAttendanceStatuses() {
  const res = await getPool().query(`
  SELECT * FROM attendancestatuses
  ORDER BY attendance_status_id
  `)
  return res.rows
}

// Create a new user
export async function createUser(email, firstName, lastName, roleId, membershipStatusId) {
  const res = await getPool().query(`
  INSERT INTO users (email, first_name, last_name, role_id, membership_status_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING user_id`, [email, firstName, lastName, roleId, membershipStatusId])
  return res.rows[0]
}

// Update an existing user
export async function editUser(userId, firstName, lastName, membershipStatusId) {
  const res = await getPool().query(`
  UPDATE users SET (first_name, last_name, membership_status_id) =
                                   ($2, $3, $4)
  WHERE user_id = $1
  RETURNING *
  `, [userId, firstName, lastName, membershipStatusId])
  return res.rows[0]
}

// Get user by userid
export async function getUser(userId) {
  const res = await getPool().query(`
  SELECT * FROM users
  WHERE user_id = $1
  `, [userId])
  return res.rows[0]
}

// Get user by email
export async function getUserByEmail(email) {
  const res = await getPool().query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
  return res.rows[0]
}

// Get all users
export async function getUsers() {
  const res = await getPool().query(`
  SELECT * FROM users
  ORDER BY CONCAT(first_name, ' ', last_name)`)
  return res.rows
}

// Create a new event
export async function createEvent(eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, typeId, loyaltyMax) {
  const res = await getPool().query(`
  INSERT INTO events (event_name, event_date, event_start, event_end, event_location, capacity, type_id, loyalty_max, cancelled, reason )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
  `, [eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, typeId, loyaltyMax, false, null])
  return res.rows[0]
}

// Update an existing event
export async function editEvent(eventId, eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, eligibilityType, loyaltyMax, cancelled, reasonCancelled) {
  const res = await getPool().query(`
  UPDATE events SET (event_name, event_date, event_start, event_end, event_location, capacity, type_id, loyalty_max, cancelled, reason) =
                                   ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  WHERE event_id = $1
  RETURNING *
  `, [eventId, eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, eligibilityType, loyaltyMax, cancelled, reasonCancelled])
  return res.rows[0]
}

// Get event by eventid
export async function getEvent(eventId) {
  const res = await getPool().query(`
  SELECT * FROM events
  WHERE event_id = $1
  `, [eventId])
  return res.rows[0]
}

// Get all events
export async function getEvents() {
  const res = await getPool().query(`
  SELECT e.*, ec.number_of_attendees FROM events e
  JOIN eventcapacity ec ON e.event_id = ec.event_id
  WHERE cancelled = false
  ORDER BY event_date`)
  return res.rows
}

// Get all cancelled events
export async function getCancelledEvents() {
  const res = await getPool().query(`
  SELECT * FROM events
  WHERE cancelled = true
  ORDER BY event_date`)
  return res.rows
}

// return event object if found, null if not found
export async function getEventWithDate(date) {
  const res = await getPool().query(`
    SELECT * FROM events
    WHERE DATE_TRUNC('day', event_date) = $1
    AND cancelled = false
    ORDER BY event_date`, [date]);
  return res.rows[0] || null;
}

// Create an event capacity record for a particular event
export async function createEventCapacity(eventId, capacity) {
  const res = await getPool().query(`
  INSERT INTO eventcapacity (event_id, capacity, number_of_attendees)
  VALUES ($1, $2, $3)
  RETURNING event_id`, [eventId, capacity, 0])
  return res.rows[0]
}

// Update event capacity record for a specific event
export async function editEventCapacity(eventId, functionType) {
  let res;
  if (functionType === "add") {
    res = await getPool().query(`
      UPDATE eventcapacity
      SET number_of_attendees = number_of_attendees + 1
      WHERE event_id = $1
      RETURNING event_id
    `, [eventId]);
  }
  else {
    res = await getPool().query(`
      UPDATE eventcapacity
      SET number_of_attendees = number_of_attendees - 1
      WHERE event_id = $1
      RETURNING event_id
    `, [eventId]);  
  }
  return res.rows[0];
}

// Get all the events years
export async function getEventYears() {
  const res = await getPool().query(`
  SELECT DISTINCT EXTRACT(YEAR FROM event_date) AS years FROM events
  ORDER BY years DESC`)
  return res.rows
}

// Create an attendee record for a particular event and user
export async function createAttendee(eventId, userId, attendeeStatusId) {
  const res = await getPool().query(`
  INSERT INTO eventattendees (event_id, user_id, attendee_status_id, attendance_status_id)
  VALUES ($1, $2, $3, $4)
  RETURNING event_id, user_id`, [eventId, userId, attendeeStatusId, 'Unknown'])
  return res.rows[0]
}

// Delete attendee record for a specific event and user
export async function deleteAttendee(eventId, userId) {
  const res = await getPool().query(`
  DELETE FROM eventattendees
  WHERE event_id = $1
  AND user_id = $2
  RETURNING *
  `, [eventId, userId])
  return res.rows[0]
}

// Get attendee records for all events for a specific user 
export async function getAttendeesByUser(userId) {
  const res = await getPool().query(`
  SELECT ea.attendee_status_id, ea.attendance_status_id, ew.user_id, ec.capacity,
  ec.number_of_attendees, e.* FROM events e
  LEFT JOIN eventattendees ea ON e.event_id = ea.event_id
  AND ea.user_id = $1
  LEFT JOIN eventwaitlist ew ON e.event_id = ew.event_id
  AND ew.user_id = $1
  JOIN eventcapacity ec ON e.event_id = ec.event_id
  WHERE cancelled = false
  ORDER BY e.event_date
  `, [userId])
  return res.rows
}

// Get attendee records for a specific event
export async function getAttendeesByEvent(eventId) {
  const res = await getPool().query(`
  SELECT ea.*, e.*, u.*, ec.number_of_attendees FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  JOIN eventcapacity ec ON e.event_id = ec.event_id
  JOIN users u ON ea.user_id = u.user_id
  WHERE ea.event_id = $1 AND e.cancelled = false
  ORDER BY u.last_name
  `, [eventId])
  return res.rows
}

// Get attendee record for a specific event and user
export async function getAttendee(userId, eventId) {
  const res = await getPool().query(`
  SELECT * FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1 AND ea.event_id = $2
  ORDER BY e.event_date
  `, [userId, eventId])
  return res.rows
}

// Update attendee status for a specific event and user
export async function editAttendee(eventId, userId, attendanceStatus) {
  const res = await getPool().query(`
    UPDATE eventattendees
    SET attendance_status_id = $3
    WHERE event_id = $1 AND user_id = $2
    RETURNING event_id, user_id
  `, [eventId, userId, attendanceStatus]);

  return res.rows[0];
}

// Update attendee status for a specific event and user
export async function editAttendeeStatus(eventId, userId, attendeeStatusId) {
  console.log("userId:", userId);
  console.log("eventId:", eventId);
  console.log("attendeeStatusId:", attendeeStatusId);
  const res = await getPool().query(`
  UPDATE eventattendees SET (attendee_status_id) = ($3)
  WHERE event_id = $1 AND user_id = $2
  RETURNING *
  `, [eventId, userId, attendeeStatusId])
  return res.rows[0]
}

// Update attendance status for a specific event and user
export async function editAttendanceStatus(eventId, userId, attendanceStatusId) {
  const res = await getPool().query(`
  UPDATE eventattendees SET (attendance_status_id) = ($3)
  WHERE event_id = $1 AND user_id = $2
  RETURNING *
  `, [eventId, userId, attendanceStatusId])
  return res.rows[0]
}

// Create a waitlist record for a specific event and user
export async function createWaitlist(eventId, userId) {
  const res = await getPool().query(`
  INSERT INTO eventwaitlist (event_id, user_id)
  VALUES ($1, $2)
  RETURNING event_id, user_id`, [eventId, userId])
  return res.rows[0]
}

// Delete a waitlist record for a specific event and user
export async function deleteWaitlist(eventId, userId) {
  const res = await getPool().query(`
  DELETE FROM eventwaitlist
  WHERE event_id = $1
  AND user_id = $2
  RETURNING *
  `, [eventId, userId])
  return res.rows[0]
}

// Get all users waitlisted for a specific event
export async function getEventWaitlist(eventId) {
  const res = await getPool().query(`
  SELECT ew.*, e.*, u.* FROM eventwaitlist ew
  JOIN events e ON ew.event_id = e.event_id
  JOIN users u ON ew.user_id = u.user_id
  WHERE ew.event_id = $1
  ORDER BY ew.waitlist_date, u.last_name
  `, [eventId])
  return res.rows
}

// Get all events for which a specific user is waitlisted
export async function getUserEventWaitlist(eventId, userId) {
  const res = await getPool().query(`
  SELECT COUNT(*) FROM eventwaitlist ew
    WHERE ew.event_id = $1 AND ew.user_id = $2
  `, [eventId, userId])
  return res.rows[0].count;
}

// Check if user is waitlisted for a specific event
export async function getUserWaitlist(userId) {
  const res = await getPool().query(`
  SELECT ew.*, e.*, u.* FROM eventwaitlist ew
  JOIN events e ON ew.event_id = e.event_id
  JOIN users u ON ew.user_id = u.user_id
  WHERE ew.user_id = $1
  ORDER BY e.event_date
  `, [userId])
  return res.rows
}

// Get position in waitlist of a specific user for a specific event
export async function getWaitlistPosition(eventId, userId) {
  const res = await getPool().query(`
  SELECT COUNT(*) + 1 AS waitlist_position
  FROM eventwaitlist
  WHERE event_id = $1
  AND waitlist_date < (SELECT waitlist_date FROM eventwaitlist WHERE event_id = $1 AND user_id = $2)
  `, [eventId, userId])
  return res.rows[0].waitlist_position
}

// Check if any capacity remains for a specific event, returns true or false
export async function anyCapacity(eventId) {
  const res = await getPool().query(`
  SELECT COUNT(*) AS number_of_attendees FROM eventattendees WHERE event_id = $1
  AND attendee_status_id = 'Registered'
 `, [eventId])
 return res.rows[0].number_of_attendees
}

// Check how many events a specific user has attended prior to today
export async function loyaltyCount(userId) {
  const res = await getPool().query(`
  SELECT COUNT(*) FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1 AND ea.attendance_status_id = 'Attended' AND e.event_date < now()
  `, [userId])
  return res.rows[0].count
}

// Count the different attendance statuses for every event
export async function eventCounts() {
  const res = await getPool().query(`
  SELECT e.event_id, ea.attendance_status_id, COUNT(ea.attendance_status_id) AS count FROM events e
  LEFT JOIN eventattendees ea ON ea.event_id = e.event_id AND ea.attendee_status_id != 'Invited'
  GROUP BY ea.attendance_status_id, e.event_id
  `, [])
  return res.rows
}

// Get remaining capacity for an event
export async function getCapacity(eventId) {
  const res = await getPool().query(`
  SELECT ec.capacity - ec.number_of_attendees AS remaining FROM eventcapacity ec
  WHERE ec.event_id = $1
  `, [eventId])
  return res.rows[0].remaining
}

