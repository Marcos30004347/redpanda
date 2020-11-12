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

#include "bytes/iobuf.h"

namespace compression {

struct snappy_standard_compressor {
    static iobuf compress(const iobuf&);
    static iobuf uncompress(const iobuf&);
};

} // namespace compression
