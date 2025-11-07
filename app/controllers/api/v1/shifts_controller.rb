module Api
  module V1
    class ShiftsController < ApplicationController
      before_action :set_shift, only: [:show, :update, :destroy]

      def index
        shifts = Shift.all
        shifts = shifts.where(date: params[:date]) if params[:date]
        shifts = shifts.where(shift_type: params[:shift_type]) if params[:shift_type]
        shifts = shifts.where(department_id: params[:department_id]) if params[:department_id]
        render json: shifts
      end

      def show
        render json: @shift
      end

      def create
        shift = Shift.new(shift_params)
        if shift.save
          render json: shift, status: :created
        else
          render json: shift.errors, status: :unprocessable_entity
        end
      end

      def update
        if @shift.update(shift_params)
          render json: @shift
        else
          render json: @shift.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @shift.destroy
        head :no_content
      end

      private

      def set_shift
        @shift = Shift.find(params[:id])
      end

      def shift_params
        params.require(:shift).permit(:date, :start_time, :end_time, :shift_type, :status, :department_id)
      end
    end
  end
end
