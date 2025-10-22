module Api
    module V1
      class QuestionsController < ApplicationController
        before_action :set_question, only: [:show, :update, :destroy]
  
        def index
          render json: Question.all
        end
  
        def show
          render json: @question
        end
  
        def create
          question = Question.new(question_params)
          if question.save
            render json: question, status: :created
          else
            render json: question.errors, status: :unprocessable_entity
          end
        end
  
        def update
          if @question.update(question_params)
            render json: @question
          else
            render json: @question.errors, status: :unprocessable_entity
          end
        end
  
        def destroy
          @question.destroy
          head :no_content
        end
  
        private
  
        def set_question
          @question = Question.find(params[:id])
        end
  
        def question_params
          params.require(:question).permit(:content, :exam_id)
        end
      end
    end
  end
  