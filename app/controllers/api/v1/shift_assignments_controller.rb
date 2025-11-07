module Api
  module V1
    class ShiftAssignmentsController < ApplicationController
      before_action :set_shift_assignment, only: [:show, :update, :destroy]

      def index
        assignments = ShiftAssignment.all
        assignments = assignments.where(user_id: params[:user_id]) if params[:user_id]
        assignments = assignments.where(shift_id: params[:shift_id]) if params[:shift_id]
        render json: assignments
      end

      def show
        render json: @shift_assignment
      end

      def create
        assignment = ShiftAssignment.new(shift_assignment_params)
        if assignment.save
          render json: assignment, status: :created
        else
          render json: assignment.errors, status: :unprocessable_entity
        end
      end

      def update
        if @shift_assignment.update(shift_assignment_params)
          render json: @shift_assignment
        else
          render json: @shift_assignment.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @shift_assignment.destroy
        head :no_content
      end

      private

      def set_shift_assignment
        @shift_assignment = ShiftAssignment.find(params[:id])
      end

      def shift_assignment_params
        params.require(:shift_assignment).permit(:user_id, :shift_id, :status, :notes)
      end
    end
  end
end
