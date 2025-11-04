require 'rails_helper'

RSpec.describe "Users API", type: :request do
  it "returns a user" do
    user = User.create!(name: "Test", email: "test@test.com", bio: "Hello Bio")
    get "/api/v1/users/#{user.id}"
    expect(response).to have_http_status(:ok)
    data = JSON.parse(response.body)
    expect(data["name"]).to eq("Test")
    expect(data["bio"]).to eq("Hello Bio")
  end
end

