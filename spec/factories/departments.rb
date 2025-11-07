FactoryBot.define do
  factory :department do
    name { Faker::Company.name }
    description { Faker::Lorem.paragraph }
  end
end

