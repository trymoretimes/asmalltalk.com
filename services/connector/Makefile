deploy: deploy-east deploy-west deploy-ap-northeast deploy-ca-central deploy-eu deploy-sa

deploy-east:
	apex --profile us-east-1 deploy
	apex --profile us-east-2 deploy

deploy-west:
	apex --profile us-west-1 deploy
	apex --profile us-west-2 deploy

deploy-ap-northeast:
	apex --profile ap-northeast-1 deploy
	apex --profile ap-northeast-2 deploy
	# apex --profile ap-northeast-3 deploy
	apex --profile ap-south-1 deploy
	apex --profile ap-southeast-1 deploy
	apex --profile ap-southeast-2 deploy

deploy-ca-central:
	apex --profile ca-central-1 deploy

deploy-eu:
	apex --profile eu-central-1 deploy
	apex --profile eu-west-1 deploy
	apex --profile eu-west-2 deploy
	apex --profile eu-west-3 deploy

deploy-sa:
	apex --profile sa-east-1 deploy
