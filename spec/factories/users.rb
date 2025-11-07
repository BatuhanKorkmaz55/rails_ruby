FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.email }
    bio { Faker::Lorem.paragraph }
    role { 'employee' }
    association :department, factory: :department
  end
end

