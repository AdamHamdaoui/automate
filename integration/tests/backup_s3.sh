#!/bin/bash

#shellcheck disable=SC2034
#shellcheck disable=SC2154

# shellcheck source=integration/helpers/s3.sh
source "${source_dir}/helpers/s3.sh"

test_name="backup-s3"
test_backup_restore=true

do_create_config() {
  do_create_config_default

  #shellcheck disable=SC2154
  cat <<EOF >> "$test_config_path"
[global.v1.backups]
  location = "s3"
[global.v1.backups.s3.bucket]
  name = "${s3_bucket_name}"
  base_path = "${s3_bucket_base_path}"
  endpoint = "${s3_endpoint}"
EOF
}

do_deploy() {
  do_deploy_s3_default
}

do_test_deploy() {
  do_test_deploy_s3_default
}

do_backup() {
  do_backup_s3_default
}

do_prepare_restore() {
  do_prepare_restore_s3_default
}

do_restore() {
  do_restore_s3_default
}

do_test_restore() {
  do_test_restore_s3_default
}
