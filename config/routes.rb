Rails.application.routes.draw do
  get '/hello', to: 'hello#index'

  namespace :api do
    namespace :v1 do
      resources :users
      resources :departments
      resources :shifts
      resources :shift_assignments
    end
  end
end
