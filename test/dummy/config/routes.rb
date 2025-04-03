Rails.application.routes.draw do
  get "static/value"
  resources :posts

  root to: redirect("/posts")
end
