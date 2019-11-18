#pragma once
#include "seastarx.h"
#include "utils/to_string.h"

#include <seastar/core/sstring.hh>
#include <seastar/net/tls.hh>

#include <optional>

namespace config {

struct key_cert {
    sstring key_file;
    sstring cert_file;
};

class tls_config {
public:
    tls_config()
      : _enabled(false)
      , _key_cert(std::nullopt)
      , _truststore_file(std::nullopt)
      , _require_client_auth(false) {
    }

    tls_config(
      bool enabled,
      std::optional<key_cert> key_cert,
      std::optional<sstring> truststore,
      bool require_client_auth)
      : _enabled(enabled)
      , _key_cert(key_cert)
      , _truststore_file(truststore)
      , _require_client_auth(require_client_auth) {
    }

    bool is_enabled() const {
        return _enabled;
    }

    const std::optional<key_cert>& get_key_cert_files() const {
        return _key_cert;
    }

    const std::optional<sstring>& get_truststore_file() const {
        return _truststore_file;
    }

    bool get_require_client_auth() const {
        return _require_client_auth;
    }

    future<std::optional<tls::credentials_builder>>
    get_credentials_builder() const {
        if (_enabled) {
            auto builder = make_lw_shared<tls::credentials_builder>();
            builder->set_dh_level(tls::dh_params::level::MEDIUM);
            if (_require_client_auth) {
                builder->set_client_auth(tls::client_auth::REQUIRE);
            }
            auto f = builder->set_system_trust();
            if (_key_cert) {
                f = f.then([this, builder] {
                    return builder->set_x509_key_file(
                      (*_key_cert).cert_file,
                      (*_key_cert).key_file,
                      tls::x509_crt_format::PEM);
                });
            }

            if (_truststore_file) {
                f = f.then([this, builder]() {
                    return builder->set_x509_trust_file(
                      *_truststore_file, tls::x509_crt_format::PEM);
                });
            }

            return f.then([builder]() { return std::make_optional(*builder); });
        }
        return make_ready_future<std::optional<tls::credentials_builder>>(
          std::nullopt);
    }

    static std::optional<sstring> validate(const tls_config& c) {
        if (c.get_require_client_auth() && !c.get_truststore_file()) {
            return "Trust store is required when client authentication is "
                   "enabled";
        }

        return std::nullopt;
    }

private:
    bool _enabled;
    std::optional<key_cert> _key_cert;
    std::optional<sstring> _truststore_file;
    bool _require_client_auth;
};

}; // namespace config

namespace std {
static ostream& operator<<(ostream& o, const config::key_cert& c) {
    o << "{ "
      << "key_file: " << c.key_file << " "
      << "cert_file: " << c.cert_file << " }";
    return o;
}
static ostream& operator<<(ostream& o, const config::tls_config& c) {
    o << "{ "
      << "enabled: " << c.is_enabled()
      << "key/cert files: " << c.get_key_cert_files() << " "
      << "ca file: " << c.get_truststore_file() << " "
      << "client_auth_required: " << c.get_require_client_auth() << " }";
    return o;
}
} // namespace std