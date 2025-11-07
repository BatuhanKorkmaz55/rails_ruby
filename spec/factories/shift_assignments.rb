FactoryBot.define do
  factory :shift_assignment do
    association :user, factory: :user
    association :shift, factory: :shift
    status { "assigned" }
    notes { Faker::Lorem.sentence }
  end
end

