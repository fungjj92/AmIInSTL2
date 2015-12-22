# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

# Ensure role dependencies are in place
if [ "up", "provision" ].include?(ARGV.first)
  require_relative "vagrant/ansible_galaxy_helper"

  AnsibleGalaxyHelper.install_dependent_roles("deployment/ansible")
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "private_network", type: "dhcp"
  config.vm.network :forwarded_port, host: 7300, guest: 9000
  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder "app", "/opt/app", :nfs => { :mount_options => ["dmode=777","fmode=777"] }

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "deployment/ansible/site.yml"
    ansible.sudo = true
  end

  config.vm.provision "docker" do |d|
    d.build_image "/opt/app", args: "-t app"
    d.run "app", args: "-p '9000:9000' -v '/opt/app:/opt/app'"
  end
end
