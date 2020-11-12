/*
 * Copyright 2020 Vectorized, Inc.
 *
 * Use of this software is governed by the Business Source License
 * included in the file licenses/BSL.md
 *
 * As of the Change Date specified in that file, in accordance with
 * the Business Source License, use of this software will be governed
 * by the Apache License, Version 2.0
 */

#pragma once
#include "kafka/errors.h"
#include "kafka/groups/group.h"
#include "kafka/requests/request_context.h"
#include "kafka/requests/response.h"
#include "kafka/requests/schemata/describe_groups_request.h"
#include "kafka/requests/schemata/describe_groups_response.h"
#include "kafka/types.h"

#include <seastar/core/future.hh>

namespace kafka {

struct describe_groups_response;

class describe_groups_api final {
public:
    using response_type = describe_groups_response;

    static constexpr const char* name = "describe groups";
    static constexpr api_key key = api_key(15);
    static constexpr api_version min_supported = api_version(0);
    static constexpr api_version max_supported = api_version(2);

    static ss::future<response_ptr>
    process(request_context&&, ss::smp_service_group);
};

struct describe_groups_request final {
    using api_type = describe_groups_api;

    describe_groups_request_data data;

    void encode(response_writer& writer, api_version version) {
        data.encode(writer, version);
    }

    void decode(request_reader& reader, api_version version) {
        data.decode(reader, version);
    }
};

inline std::ostream&
operator<<(std::ostream& os, const describe_groups_request& r) {
    return os << r.data;
}

struct describe_groups_response final {
    using api_type = describe_groups_api;

    describe_groups_response_data data;

    void encode(const request_context& ctx, response& resp) {
        data.encode(resp.writer(), ctx.header().version);
    }

    void decode(iobuf buf, api_version version) {
        data.decode(std::move(buf), version);
    }

    static described_group
    make_empty_described_group(group_id g, error_code e) {
        return described_group{
          .error_code = e,
          .group_id = std::move(g),
          .group_state = "",
          .protocol_type = kafka::protocol_type(),
          .protocol_data = "",
        };
    }

    static described_group make_dead_described_group(group_id g) {
        return described_group{
          .error_code = error_code::none,
          .group_id = std::move(g),
          .group_state = group_state_to_kafka_name(group_state::dead),
          .protocol_type = kafka::protocol_type(),
          .protocol_data = "",
        };
    }
};

inline std::ostream&
operator<<(std::ostream& os, const describe_groups_response& r) {
    return os << r.data;
}

} // namespace kafka
