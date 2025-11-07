FactoryBot.define do
  factory :shift do
    date { Date.today }
    start_time { "09:00:00" }
    end_time { "17:00:00" }
    shift_type { "morning" }
    status { "scheduled" }
    association :department, factory: :department
  end
end

