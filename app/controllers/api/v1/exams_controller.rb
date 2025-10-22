module Api
    module V1
      class ExamsController < ApplicationController
        before_action :set_exam, only: [:show, :update, :destroy]
  
        def index
          render json: Exam.all
        end
  
        def show
          render json: @exam
        end
  
        def create
          exam = Exam.new(exam_params)
          if exam.save
            render json: exam, status: :created
          else
            render json: exam.errors, status: :unprocessable_entity
          end
        end
  
        def update
          if @exam.update(exam_params)
            render json: @exam
          else
            render json: @exam.errors, status: :unprocessable_entity
          end
        end
  
        def destroy
          @exam.destroy
          head :no_content
        end
  
        private
  
        def set_exam
          @exam = Exam.find(params[:id])
        end
  
        def exam_params
          params.require(:exam).permit(:name, :course_id)
        end
      end
    end
  end
  