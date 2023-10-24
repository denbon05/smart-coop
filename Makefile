setup:
	cd backend && npm i
	cd blockchain && npm i
	cd frontend && npm i

up:
	docker compose --env-file .env.dev up --renew-anon-volumes

up-d:
	docker compose --env-file .env.dev up -d

# down containers and remove volumes
down:
	docker compose down --volumes
