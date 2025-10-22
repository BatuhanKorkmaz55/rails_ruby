class HelloController < ApplicationController
  def index
    render json: { message: 'Hello, Ruby on Rails API is working!' }
  end
end
