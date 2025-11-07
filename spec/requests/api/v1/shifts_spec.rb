require 'rails_helper'

RSpec.describe "Shifts API", type: :request do
  describe "GET /api/v1/shifts" do
    it "returns all shifts" do
      create_list(:shift, 3)
      get "/api/v1/shifts"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(3)
    end

    it "filters shifts by date" do
      shift1 = create(:shift, date: Date.today)
      shift2 = create(:shift, date: Date.tomorrow)
      get "/api/v1/shifts?date=#{Date.today}"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(1)
      expect(data.first["id"]).to eq(shift1.id)
    end
  end

  describe "GET /api/v1/shifts/:id" do
    it "returns a shift" do
      shift = create(:shift)
      get "/api/v1/shifts/#{shift.id}"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["shift_type"]).to eq(shift.shift_type)
    end
  end

  describe "POST /api/v1/shifts" do
    it "creates a new shift" do
      department = create(:department)
      shift_params = {
        shift: {
          date: Date.today,
          start_time: "09:00:00",
          end_time: "17:00:00",
          shift_type: "morning",
          status: "scheduled",
          department_id: department.id
        }
      }
      post "/api/v1/shifts", params: shift_params
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data["shift_type"]).to eq("morning")
    end
  end

  describe "PATCH /api/v1/shifts/:id" do
    it "updates a shift" do
      shift = create(:shift)
      update_params = {
        shift: {
          shift_type: "afternoon"
        }
      }
      patch "/api/v1/shifts/#{shift.id}", params: update_params
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["shift_type"]).to eq("afternoon")
    end
  end

  describe "DELETE /api/v1/shifts/:id" do
    it "deletes a shift" do
      shift = create(:shift)
      delete "/api/v1/shifts/#{shift.id}"
      expect(response).to have_http_status(:no_content)
      expect(Shift.find_by(id: shift.id)).to be_nil
    end
  end
end
