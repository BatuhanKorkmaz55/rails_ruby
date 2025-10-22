Rails.application.routes.draw do
  get '/hello', to: 'hello#index'

  namespace :api do
    namespace :v1 do
      resources :users
      resources :courses
      resources :exams
      resources :questions
      resources :responses
    end
  end
end
