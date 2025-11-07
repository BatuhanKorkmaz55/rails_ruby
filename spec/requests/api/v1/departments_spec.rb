require 'rails_helper'

RSpec.describe "Departments API", type: :request do
  describe "GET /api/v1/departments" do
    it "returns all departments" do
      create_list(:department, 3)
      get "/api/v1/departments"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(3)
    end
  end

  describe "GET /api/v1/departments/:id" do
    it "returns a department" do
      department = create(:department)
      get "/api/v1/departments/#{department.id}"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["name"]).to eq(department.name)
      expect(data["description"]).to eq(department.description)
    end
  end

  describe "POST /api/v1/departments" do
    it "creates a new department" do
      department_params = {
        department: {
          name: "IT Department",
          description: "Information Technology"
        }
      }
      post "/api/v1/departments", params: department_params
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data["name"]).to eq("IT Department")
    end
  end

  describe "PATCH /api/v1/departments/:id" do
    it "updates a department" do
      department = create(:department)
      update_params = {
        department: {
          name: "Updated Department"
        }
      }
      patch "/api/v1/departments/#{department.id}", params: update_params
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["name"]).to eq("Updated Department")
    end
  end

  describe "DELETE /api/v1/departments/:id" do
    it "deletes a department" do
      department = create(:department)
      delete "/api/v1/departments/#{department.id}"
      expect(response).to have_http_status(:no_content)
      expect(Department.find_by(id: department.id)).to be_nil
    end
  end
end
