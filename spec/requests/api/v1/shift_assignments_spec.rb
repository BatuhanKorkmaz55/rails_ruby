require 'rails_helper'

RSpec.describe "ShiftAssignments API", type: :request do
  describe "GET /api/v1/shift_assignments" do
    it "returns all shift assignments" do
      create_list(:shift_assignment, 3)
      get "/api/v1/shift_assignments"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(3)
    end

    it "filters by user_id" do
      user = create(:user)
      assignment1 = create(:shift_assignment, user: user)
      assignment2 = create(:shift_assignment)
      get "/api/v1/shift_assignments?user_id=#{user.id}"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(1)
      expect(data.first["id"]).to eq(assignment1.id)
    end
  end

  describe "GET /api/v1/shift_assignments/:id" do
    it "returns a shift assignment" do
      assignment = create(:shift_assignment)
      get "/api/v1/shift_assignments/#{assignment.id}"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["status"]).to eq(assignment.status)
    end
  end

  describe "POST /api/v1/shift_assignments" do
    it "creates a new shift assignment" do
      user = create(:user)
      shift = create(:shift)
      assignment_params = {
        shift_assignment: {
          user_id: user.id,
          shift_id: shift.id,
          status: "assigned",
          notes: "Test notes"
        }
      }
      post "/api/v1/shift_assignments", params: assignment_params
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data["status"]).to eq("assigned")
    end
  end

  describe "PATCH /api/v1/shift_assignments/:id" do
    it "updates a shift assignment" do
      assignment = create(:shift_assignment)
      update_params = {
        shift_assignment: {
          status: "confirmed"
        }
      }
      patch "/api/v1/shift_assignments/#{assignment.id}", params: update_params
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["status"]).to eq("confirmed")
    end
  end

  describe "DELETE /api/v1/shift_assignments/:id" do
    it "deletes a shift assignment" do
      assignment = create(:shift_assignment)
      delete "/api/v1/shift_assignments/#{assignment.id}"
      expect(response).to have_http_status(:no_content)
      expect(ShiftAssignment.find_by(id: assignment.id)).to be_nil
    end
  end
end
