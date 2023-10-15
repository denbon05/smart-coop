setup:
	cd backend && npm i
	cd blockchain && npm i
	cd frontend && npm i

up:
	docker compose --env-file .env.dev up

up-d:
	docker compose --env-file .env.dev up -d

down:
	docker compose down
