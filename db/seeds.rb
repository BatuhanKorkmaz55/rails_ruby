# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data
ShiftAssignment.destroy_all
Shift.destroy_all
User.where.not(id: 1).destroy_all
Department.destroy_all

# Create Departments
dept1 = Department.find_or_create_by!(name: "Production") do |d|
  d.description = "Production Department"
end

dept2 = Department.find_or_create_by!(name: "Quality Control") do |d|
  d.description = "Quality Control Department"
end

dept3 = Department.find_or_create_by!(name: "Logistics") do |d|
  d.description = "Logistics Department"
end

# Update existing user
user1 = User.find_by(id: 1)
if user1
  user1.update!(role: 'manager', department_id: dept1.id)
end

# Create new users
user2 = User.find_or_create_by!(email: "ahmet@example.com") do |u|
  u.name = "Ahmet Yilmaz"
  u.role = "employee"
  u.department_id = dept1.id
  u.bio = "Production employee"
end

user3 = User.find_or_create_by!(email: "ayse@example.com") do |u|
  u.name = "Ayse Demir"
  u.role = "employee"
  u.department_id = dept2.id
  u.bio = "Quality control employee"
end

user4 = User.find_or_create_by!(email: "mehmet@example.com") do |u|
  u.name = "Mehmet Kaya"
  u.role = "employee"
  u.department_id = dept3.id
  u.bio = "Logistics employee"
end

# Create Shifts
today = Date.today

shift1 = Shift.find_or_create_by!(date: today, shift_type: 'morning', department_id: dept1.id) do |s|
  s.start_time = Time.parse("08:00")
  s.end_time = Time.parse("16:00")
  s.status = 'scheduled'
end

shift2 = Shift.find_or_create_by!(date: today, shift_type: 'afternoon', department_id: dept2.id) do |s|
  s.start_time = Time.parse("16:00")
  s.end_time = Time.parse("00:00")
  s.status = 'scheduled'
end

shift3 = Shift.find_or_create_by!(date: today + 1, shift_type: 'night', department_id: dept3.id) do |s|
  s.start_time = Time.parse("00:00")
  s.end_time = Time.parse("08:00")
  s.status = 'scheduled'
end

# Create Shift Assignments
ShiftAssignment.find_or_create_by!(user_id: user2.id, shift_id: shift1.id) do |sa|
  sa.status = 'confirmed'
  sa.notes = "Morning shift assignment"
end

ShiftAssignment.find_or_create_by!(user_id: user3.id, shift_id: shift2.id) do |sa|
  sa.status = 'confirmed'
  sa.notes = "Afternoon shift assignment"
end

ShiftAssignment.find_or_create_by!(user_id: user4.id, shift_id: shift3.id) do |sa|
  sa.status = 'assigned'
  sa.notes = "Night shift assignment"
end

puts "Seed data created successfully!"
